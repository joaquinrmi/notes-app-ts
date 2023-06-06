class ModelError
{
    public static Name(err: any): ModelError["name"]
    {
        try
        {
            return (err as ModelError).name;
        }
        catch(err)
        {
            return "no type";
        }
    }

    public static Message(err: any): ModelError["message"]
    {
        try
        {
            return (err as ModelError).message;
        }
        catch(err)
        {
            return "No message available.";
        }
    }

    public readonly name: string;
    public readonly message?: string;

    constructor(name: string, message?: string)
    {
        this.name = name;
        this.message = message;
    }
}

export default ModelError;