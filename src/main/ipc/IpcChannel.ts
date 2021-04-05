import {IpcMainInvokeEvent} from "electron";

export default abstract class IpcChannel {
    NAME: string;
    commands: object = {};

    protected constructor(commands: object) {
        this.commands = commands;
    }

    getName = (): string => {
        return this.NAME;
    };

    handle = (event: IpcMainInvokeEvent, ...args: any[]) => {
        const argsOnly: any[] = args.slice(1, args.length);
        if (args[0]) {
            // @ts-ignore
            return this.commands[args[0]](...argsOnly);
        }
    };

}
