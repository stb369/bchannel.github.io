//指定したウォレットアドレスの中にある貧乏神などの仮想通貨の各所持量を取得する関数
//arg1…貧乏神のスマートコントラクトアドレス
//arg2
//arg3
//arg4
//arg5
//arg6
  
export default function f0001(arg1,arg2,arg3,arg4,arg5,arg6) {
  
  console.log("f0002 launched");
  
  try {
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
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
}
          
       
