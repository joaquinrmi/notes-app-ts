import { Model } from "sequelize";
import If from "../conditional/if";
import IsFunction from "../conditional/is_function";
import Not from "../conditional/not";

type EntityData<T> = { [P in keyof Omit<T, keyof Model<T>>]?: If<T[P], Not<IsFunction<T[P]>>> };

export default EntityData;