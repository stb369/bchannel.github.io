

//このソースファイルをC#のURLで指定する
hoge = function() {
    return {
        // Unityからのメッセージを受け取るハンドラ登録
        InitializationEventListener: function() {
            console.log('InitializationEventListener called');
            window.addEventListener('message', function(event) {
                hoge.ExecuteJs(event.data);
              }, false);
          },
        FetchJS: async function(methodName, parameterObject){
        
            //非同期処理
            let functionMeta;
            fetch('./js/functions.json').then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // JSONとしてパース
  }).then(data => {console.log("data: " + data[methodName]); functionMeta = data[methodName]}).then(data => {
            console.log("functionMeta:" + functionMeta);
            const filePath = functionMeta;//functionMetaに格納する時点でvalue値にする
            if (!filePath) {
                console.warn(`メソッド "${methodName}" に対応するファイルが見つかりません。`);
            return;
            }

            // 動的にファイルをインポートして関数を実行
            const module = import(filePath);
            console.log('module:\n' + module.default.toString());
            if (typeof module === 'function') {
                console.log('That is goal');
                module(parameterObject.arg1,parameterObject.arg2,parameterObject.arg3,parameterObject.arg4,parameterObject.arg5,parameterObject.arg6); // デフォルトエクスポートされた関数を実行
            } else {
                console.warn(`"${methodName}" は有効な関数ではありません。`);
            }
    });
        },
        // 受け取ったメッセージから、evalを使って関数を呼び出す
        ExecuteJs: function(message) {
            console.log("ExecuteJs message:"+message);
            //引数をJsonに
            if (typeof (message) !== "string" && !(message instanceof String) || message == "null") {
                return;
            }
            var parameterObject = JSON.parse(message);
            var methodName = parameterObject.MethodName;
            // メタデータから対応するファイルパスを取得
            console.log('methodName:'+methodName);
            (async () => {
                await hoge.FetchJS(methodName, parameterObject);
            })();
        },
        
        ShowHtml: function(parameterObject) {
            // IFrame生成
            webview.method.CreateIframe(parameterObject);
            // HTML読み込み
            var iframe = document.getElementById('webViewIframe');
            iframe.contentWindow.location.href = 'about:blank';
            iframe.onload = function() {
                // IFrame内のドキュメントを取得する
                var iframeDocument = iframe.contentWindow.document;
                // ドキュメントにHTMLソースを書き込む
                iframeDocument.open();
                iframeDocument.write(parameterObject.Content);
                iframeDocument.close();
                iframe.onload = function() {};
            };
        },

        getSourceCode: function() {
            return document.getElementById("source").value;
          },
        
          getVersion: function() {
            return document.getElementById("versions").value;
          },
        
          status: function(txt) {
            document.getElementById("status").innerHTML = txt;
          },
        
          populateVersions: function(versions) {
            sel = document.getElementById("versions");
            sel.innerHTML = "";
        
            for(var i = 0; i < versions.length; i++) {
                var opt = document.createElement('option');
                opt.appendChild( document.createTextNode(versions[i]) );
                opt.value = versions[i]; 
                sel.appendChild(opt); 
            }
          },
        
          solcCompile: function(compiler) {
            status("compiling");
            document.getElementById("compile-output").value = "";
            var result = compiler.compile(getSourceCode(), 1);
            var stringResult = JSON.stringify(result);
            document.getElementById("compile-output").value = stringResult;
            status("Compile Complete.");
          },
        
          loadSolcVersion: function() {
            status("Loading Solc: " + getVersion());
            BrowserSolc.loadVersion(getVersion(), function(c) {
                compiler = c;
                console.log("Solc Version Loaded: " + getVersion());
                status("Solc loaded.  Compiling...");
                solcCompile(compiler);
            });
          },
        
          CompileUniqueContract: function(solidityCode) {
            
            const code = UTF8ToString(solidityCode);
            console.log("compile address:"+code);
            const input = {
              language: 'Solidity',
              sources: {
                'Unique.sol': {
                  content: code
                }
              },
              settings: {
                outputSelection: {
                  '*': {
                    '*': ['abi', 'evm.bytecode']
                  }
                }
              }
            };
          
            try {
              const output = JSON.parse(compiler.compile(JSON.stringify(input),1));
              if (output.errors) {
                const errors = output.errors.map(e => e.formattedMessage).join('\n');
                console.log('errors:'+errors);
                SendMessage('ContractCompiler', 'OnCompilationError', errorMessages);
                return;
              }
          
              const contract = output.contracts['Unique.sol'];
              const name = Object.keys(contract)[0];
              const abi = contract[name].abi;
              const bytecode = contract[name].evm.bytecode.object;
              const result = JSON.stringify({ abi, bytecode });
          
              console.log('result:' + result);
              SendMessage('ContractCompiler', 'OnContractCompiled', result);
            } catch (e) {
              console.log('e:' + e.message);
              SendMessage('ContractCompiler', 'OnCompilationError', e.message);
            }
          },
        
          InitOnLoad: function() {
            if (typeof window !== 'undefined') {
              window.addEventListener('load', function () {
                console.log("window.onload triggered from jslib!");
                // ここに初期化処理など
              });
            }
          }
          
          
    };

      
}();
