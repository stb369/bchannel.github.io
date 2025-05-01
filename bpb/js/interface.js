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
        // 受け取ったメッセージから、evalを使って関数を呼び出す
        ExecuteJs: function(message) {
            console.log("ExecuteJs message:"+message);
            if (typeof (message) !== "string" && !(message instanceof String) || message == "null") {
                return;
            }
            var parameterObject = JSON.parse(message);
            var methodName = parameterObject.MethodName;
            var evalString = methodName + '(parameterObject)';
            eval(evalString);//このevalStringの中に、JavaScriptのソースコードが入っている
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
                console.log("✅ window.onload triggered from jslib!");
                // ここに初期化処理など
              });
            }
          }
          
          
    };

      
}();
