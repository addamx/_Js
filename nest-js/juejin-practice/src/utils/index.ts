import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';

export const getEnv = () => process.env.RUNNING_ENV;

export const getConfig = () => {
  const environment = getEnv();
  const yamlPath = path.join(process.cwd(), `.config/.${environment}.yaml`);
  const file = fs.readFileSync(yamlPath, 'utf8');
  const config = parse(file);
  return config;
};
