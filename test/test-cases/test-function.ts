const GLOBALLY_DEFINED = 'test';

export default function testFunction(argument: string): string {
   const locallyDefinedConst = 'test';

   const returnValue = argument + locallyDefinedConst;

   return returnValue + GLOBALLY_DEFINED;
}
