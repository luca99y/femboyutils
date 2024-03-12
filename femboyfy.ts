import Seed from "./seed";


export default class Femboyfy {
    public ends: string[] = [
        ":3",
        "UwU",
        "~Nya",
        ">:3",
        "<3"
      ];

      public femboyfy(sentence: string): string {
        let femboyfyiedstring = sentence;
    
        const seed = new Seed(femboyfyiedstring);
        const random = seed.random();

        femboyfyiedstring += " " + this.ends[seed.randomInt(0, this.ends.length - 1)];
    
        return femboyfyiedstring;
      }
}