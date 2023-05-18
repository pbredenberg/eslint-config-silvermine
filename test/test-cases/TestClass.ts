export class TestClass {

   protected static _banana_sweetness: string;

   private static _apple_type: string;

   private readonly _orange: string;

   public constructor(test: string) {
      this._orange = test;
      TestClass._apple_type = test;
   }

   public static get_apple_type(): string {
      return TestClass._apple_type;
   }

   public getOrange(): string {
      return this._getOrange();
   }

   public getApple(): string {
      return TestClass.get_apple_type();
   }

   protected _getBananaSweetness(): string {
      return TestClass._banana_sweetness;
   }


   private _getOrange(): string {
      return this._orange;
   }
}
