export type ParamChecker = (param: any) => boolean;

export class Validation
{
    private queue: Array<ParamChecker>;

    private static _emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    constructor()
    {
        this.queue = [];
    }

    public static optional(elementChecker?: Validation): Validation
    {
        const validation = new Validation();

        validation.queue.push((param) =>
        {
            if(param === undefined || !elementChecker || elementChecker.end()(param))
            {
                return true;
            }

            return false;
        });

        return validation;
    }

    public static isString(): Validation
    {
        const validation = new Validation();

        validation.queue.push((param) =>
        {
            return typeof param === "string";
        });

        return validation;
    }

    public static isEmail(): Validation
    {
        const validation = new Validation();

        validation.queue.push((param) =>
        {
            return this._emailRegex.test(param);
        });

        return validation;
    }

    public static isNumber(): Validation
    {
        const validation = new Validation();

        validation.queue.push((param) =>
        {
            return typeof param === "number";
        });

        return validation;
    }

    public static canBeNumber(): Validation
    {
        const validation = new Validation();

        validation.queue.push((param) =>
        {
            return Number.isFinite(Number(param));
        });

        return validation;
    }

    public static isArray(elementChecker?: Validation): Validation
    {
        const validation = new Validation();

        validation.queue.push((param) => 
        {
            if(!Array.isArray(param))
            {
                return false;
            }

            if(!elementChecker)
            {
                return true;
            }

            for(let element of param)
            {
                if(!elementChecker.end()(element))
                {
                    return false;
                }
            }

            return true;
        });

        return validation;
    }

    public static isArrayPattern(elementCheckers: ParamChecker[]): Validation
    {
        const validation = new Validation();

        validation.queue.push((param) => 
        {
            if(!Array.isArray(param))
            {
                return false;
            }

            if(param.length < elementCheckers.length)
            {
                return false;
            }
            
            for(let i = 0; i < elementCheckers.length; ++i)
            {
                if(!elementCheckers[i](param[i]))
                {
                    return false;
                }
            }

            return true;
        });

        return validation;
    }

    public static in(values: Array<any>): Validation
    {
        const validation = new Validation();

        validation.queue.push((param) =>
        {
            for(let value of values)
            {
                if(param === value)
                {
                    return true;
                }
            }

            return false;
        });

        return validation;
    }

    public notEmpty(): Validation
    {
        this.queue.push((param) =>
        {
            return param.length > 0;
        });

        return this;
    }

    public minLength(length: number): Validation
    {
        this.queue.push((param) =>
        {
            return param.length >= length;
        });

        return this;
    }

    public end(): ParamChecker
    {
        return (param) =>
        {
            for(let checker of this.queue)
            {
                if(!checker(param))
                {
                    return false;
                }
            }

            return true;
        };
    }
}