import * as yargs from 'yargs';
import { clone } from './scm';

export async function cloneCommand(args: yargs.Arguments): Promise<void> {
    const spaceId: string = args.spaceId;
    const contentfulManagementAccessToken: string = args.contentfulManagementAccessToken;

    const actualParentPath = 'c:\\workspace';
    await clone(spaceId, actualParentPath, contentfulManagementAccessToken);
}


