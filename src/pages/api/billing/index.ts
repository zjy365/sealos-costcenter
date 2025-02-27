import { authSession } from '@/service/backend/auth';
import { CRDMeta, GetCRD } from '@/service/backend/kubernetes';
import { jsonRes } from '@/service/backend/response';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApplyYaml } from '@/service/backend/kubernetes';
import * as yaml from 'js-yaml';
import crypto from 'crypto';
import type { BillingData, BillingSpec } from '@/types/billing';
export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
  try {
    const kc = await authSession(req.headers);

    // get user account payment amount
    const user = kc.getCurrentUser();
    if (user === null) {
      return jsonRes(resp, { code: 401, message: 'user null' });
    }
    const namespace = 'ns-' + user.name;
    const body = req.body
    console.log(body)
    let spec: BillingSpec = body.spec
    if(!spec ) {
      return jsonRes(resp, {code: 400,error:'参数错误'})
    }
    // const spec: BillingSpec = {
    //   startTime: '2023-05-08T11:00:00Z',
    //   endTime: '2023-05-15T11:00:00Z',
    //   page: 1,
    //   pageSize: 10,
    //   type: 1,
    // };
    const hash = crypto.createHash('sha256').update(JSON.stringify(spec));
    const name = hash.digest('hex');
    const crdSchema = {
      apiVersion: `account.sealos.io/v1`,
      kind: 'BillingRecordQuery',
      metadata: {
        name,
        namespace
      },
      spec
    };
    const meta: CRDMeta = {
      group: 'account.sealos.io',
      version: 'v1',
      namespace,
      plural: 'billingrecordqueries'
    };
    try {
      console.log('create!!!')
      await ApplyYaml(kc, yaml.dump(crdSchema));
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
    } finally {
      const { body } = await GetCRD(kc, meta, name);
      
      if(!('item' in (body as BillingData).status)) {
        (body as BillingData).status.item = []
      }
      if(!('deductionAmount' in (body as BillingData).status)) {
        (body as BillingData).status.deductionAmount = {
          cpu:0,
          memory:0,
          storage:0
        }
      }
      return jsonRes(resp, {
        code: 200,
        data: body
      });
    }
  } catch (error) {
    jsonRes(resp, { code: 500, data: error });
  }
}
