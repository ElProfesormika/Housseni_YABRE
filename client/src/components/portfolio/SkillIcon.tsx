import { mediaUrl } from '../../api';
import {
  BarChart3,
  Box,
  Brain,
  Cloud,
  Code2,
  Database,
  GitBranch,
  Network,
  Server,
  ShieldCheck,
  Workflow,
} from 'lucide-react';

const DEVICON: Record<string, string> = {
  python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  pandas: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
  numpy: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg',
  sql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  postgresql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  database: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  mongodb: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  spark: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg',
  apachespark: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg',
  aws: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
  docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  kubernetes: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
  linux: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
  bash: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
  git: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  github: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  react: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  flask: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',
  fastapi: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  java: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  r: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg',
  c: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
  matlab: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg',
  tensorflow: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
  pytorch: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg',
  scikitlearn: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg',
  jupyter: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg',
  html: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  php: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  powerbi: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuresqldatabase/azuresqldatabase-original.svg',
};

const LUCIDE: Record<string, typeof Brain> = {
  ml: Brain,
  brain: Brain,
  etl: Workflow,
  workflow: Workflow,
  airflow: Workflow,
  cloud: Cloud,
  server: Server,
  chart: BarChart3,
  code: Code2,
  box: Box,
  quality: ShieldCheck,
  architecture: Database,
  network: Network,
  cicd: GitBranch,
};

function resolveKey(icon?: string | null, name?: string) {
  const raw = `${icon || ''} ${name || ''}`.toLowerCase();
  const compact = raw.replace(/[\s/_-]+/g, '');
  const keys = Object.keys(DEVICON).concat(Object.keys(LUCIDE));
  for (const key of keys) {
    if (raw.split(/[\s,+/()]+/).includes(key)) return key;
    if (key.length >= 3 && compact.includes(key)) return key;
  }
  if (raw.includes('python')) return 'python';
  if (raw.includes('pandas')) return 'pandas';
  if (raw.includes('numpy')) return 'numpy';
  if (raw.includes('postgres') || raw.includes('sql')) return 'postgresql';
  if (raw.includes('spark')) return 'spark';
  if (raw.includes('airflow')) return 'airflow';
  if (raw.includes('docker')) return 'docker';
  if (raw.includes('kubernetes') || raw.includes('k8s')) return 'kubernetes';
  if (raw.includes('linux') || raw.includes('bash')) return 'linux';
  if (raw.includes('aws') || raw.includes('amazon')) return 'aws';
  if (raw.includes('git')) return 'git';
  if (raw.includes('react')) return 'react';
  if (raw.includes('flask')) return 'flask';
  if (raw.includes('fastapi')) return 'fastapi';
  if (raw.includes('java')) return 'java';
  if (raw.includes('matlab')) return 'matlab';
  if (raw.includes('scikit') || raw.includes('sklearn')) return 'scikitlearn';
  if (raw.includes('pytorch')) return 'pytorch';
  if (raw.includes('tensor')) return 'tensorflow';
  if (raw.includes('machine') || raw.includes('deep') || raw.includes('llm') || raw.includes(' xai') || raw.includes('xgboost')) return 'ml';
  if (raw.includes('etl') || raw.includes('pipeline')) return 'etl';
  if (raw.includes('qualité') || raw.includes('quality') || raw.includes('validation')) return 'quality';
  if (raw.includes('lake') || raw.includes('warehouse') || raw.includes('schema') || raw.includes('parquet')) return 'architecture';
  if (raw.includes('ci/cd') || raw.includes('cicd')) return 'cicd';
  return 'code';
}

export default function SkillIcon({
  icon,
  iconUrl,
  name,
  size = 36,
}: {
  icon?: string | null;
  iconUrl?: string | null;
  name?: string;
  size?: number;
}) {
  if (iconUrl) {
    return (
      <span className="skill-card__logo" aria-hidden>
        <img src={mediaUrl(iconUrl)} alt="" width={size} height={size} loading="lazy" />
      </span>
    );
  }

  const key = resolveKey(icon, name);
  const src = DEVICON[key];
  if (src) {
    return (
      <span className="skill-card__logo" aria-hidden>
        <img src={src} alt="" width={size} height={size} loading="lazy" />
      </span>
    );
  }

  const Icon = LUCIDE[key] || Code2;
  return (
    <span className="skill-card__logo skill-card__logo--fallback" aria-hidden>
      <Icon size={Math.round(size * 0.72)} />
    </span>
  );
}
