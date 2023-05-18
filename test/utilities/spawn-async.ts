import { spawn } from 'child_process';

export const spawnAsync = async (directory: string, command: string, args: string[]): Promise<void> => {
   console.info(`Executing '${command} ${args.join(' ')}' in ${directory}`);

   return new Promise((resolve, reject) => {
      const process = spawn(command, args, {
         cwd: directory,
         stdio: 'inherit',
      });

      process?.stderr?.on('data', () => {
         reject();
      });

      process.on('exit', () => {
         resolve();
      });
   });
};
