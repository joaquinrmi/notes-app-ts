import { Transaction } from "sequelize";
import ApplicationUnitOfWork from "./application_unit_of_work";
import UnitOfWork from "./unit_of_work";

class SubordinateUnitOfWork extends ApplicationUnitOfWork
{
    constructor(transaction: Transaction)
    {
        super(transaction);
    }

    public static create(unitOfWork: UnitOfWork): SubordinateUnitOfWork
    {
        const subordinateUnitOfWork = new SubordinateUnitOfWork(unitOfWork.transaction);
        subordinateUnitOfWork.setRepositories();

        return subordinateUnitOfWork;
    }

    public override async saveChanges(): Promise<void>
    {
        return;
    }

    public override async discardChanges(): Promise<void>
    {
        return;
    }
}

export default SubordinateUnitOfWork;