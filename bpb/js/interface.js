

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
            const filePath = functionMeta;//functionMetaに格納する時点でvalue値にする
            if (!filePath) {
                console.warn(`メソッド "${methodName}" に対応するファイルが見つかりません。`);
            return;
            }

            console.log("filepath '" + filePath + "'");
            // 動的にファイルをインポートして関数を実行
            //const {module} = import(filePath);
            import(filePath).then((myModule) => {
                if (myModule.default && typeof myModule.default === 'function'){
                    myModule.default(parameterObject.arg1,parameterObject.arg2,parameterObject.arg3,parameterObject.arg4,parameterObject.arg5,parameterObject.arg6); // デフォルトエクスポートされた関数を実行
                }else{
                    console.log("module error");
                }
                //module(parameterObject.arg1,parameterObject.arg2,parameterObject.arg3,parameterObject.arg4,parameterObject.arg5,parameterObject.arg6); // デフォルトエクスポートされた関数を実行
            });
            
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
            var result = solc.compile(getSourceCode(), 1);
            var stringResult = JSON.stringify(result);
            document.getElementById("compile-output").value = stringResult;
            status("Compile Complete.");
          },
        
          loadSolcVersion: function() {
            status("Loading Solc: " + getVersion());
            solc.loadVersion(getVersion(), function(c) {
                compiler = c;
                console.log("Solc Version Loaded: " + getVersion());
                status("Solc loaded.  Compiling...");
                solcCompile(compiler);
            });
          }
    };

      
}();
