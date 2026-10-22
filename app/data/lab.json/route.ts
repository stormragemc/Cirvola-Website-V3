// /data/lab.json: the Lab data (materials, processes, discoveries, briefs), as the original site published it.
import { lab } from '@/content/lab';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(lab);
}
