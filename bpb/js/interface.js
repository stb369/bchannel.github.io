

//このソースファイルをC#のURLで指定する
hoge = function() {
    return {
        // Unityからのメッセージを受け取るハンドラ登録
        InitializationEventListener: function(callbackGameObjectName) {
            console.log('InitializationEventListener called');
            window.addEventListener('message', function(event) {
                console.log("unity origin:"+event.origin+
                            "\nweb origin"+window.location.origin+
                           "\nmessage"+event.message+
                            "\ntransfer"+event.transfer
                           )
                hoge.ExecuteJs(event.data);
              }, false);
            
            window.InterfaceCS.SendMessage(callbackGameObjectName,"OnEventLog","JSInjectionCompleted:true");
          },
        FetchJS: async function(methodName, parameterObject, callbackGameObjectName){
        
            //非同期処理
            let functionMeta;
            const response = await fetch('./js/functions.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log("data: " + data[methodName]);
            functionMeta = data[methodName];
            const filePath = functionMeta;
            console.log("filepath '" + filePath + "'");
            if (!filePath) {
                console.warn(`メソッド "${methodName}" に対応するファイルが見つかりません。`);
            return;
            }
            const myModule = await import(filePath);
            if (myModule.default && typeof myModule.default === 'function'){
                    const result = await myModule.default(parameterObject.arg1,parameterObject.arg2,parameterObject.arg3,parameterObject.arg4,parameterObject.arg5,parameterObject.arg6); // デフォルトエクスポートされた関数を実行
                    let resultString;
                    if(typeof result != 'string')
                    {
                        console.log("result is not string:", result);
                        resultString = result.toString();
                    }else{
                        resultString = result;
                    }
                    if(typeof window.InterfaceCS !== "undefined" && window.InterfaceCS?.SendMessage){
                            window.InterfaceCS.SendMessage(callbackGameObjectName,"OnEventLog",resultString);
                        }else{
                            // ✅ Unity Editor上での通信
                            fetch("http://localhost:5005/", {
                              method: "POST",
                              headers: { "Content-Type": "text/plain" },
                              body: resultString,
                            }).catch(err => console.error("Unity Editorへの送信失敗:", err));
  
                        }
                }else{
                    console.log("module error");
                }
            
            
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
            var callbackGameObjectName = parameterObject.CallbackGameObjectName;
            // メタデータから対応するファイルパスを取得
            console.log('methodName:'+methodName + "¥ncallbackGameObjectName: "+callbackGameObjectName);
            (async () => {
                await hoge.FetchJS(methodName, parameterObject,callbackGameObjectName);
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
