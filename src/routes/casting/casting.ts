import PropertyCast from "./property_cast";

class Casting
{
    public static toBoolean(): PropertyCast<boolean>
    {
        return (param) => Boolean(param);
    }
    
    public static toNumber(): PropertyCast<number>
    {
        return (param) => Number(param);
    }

    public static toString(): PropertyCast<string>
    {
        return (param) => String(param);
    }
}

export default Casting;