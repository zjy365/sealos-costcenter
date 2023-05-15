import * as yaml from 'js-yaml';
import { CRDMeta } from '@/types/crd';
import dayjs from 'dayjs';
import localdata from 'dayjs/plugin/localeData';
import 'dayjs/locale/zh-cn';
dayjs.extend(localdata);
dayjs.locale('zh-cn');
export type PaymentForm = {
  paymentName: string;
  namespace: string;
  userId: string;
  amount: string;
};

export const paymentMeta: CRDMeta = {
  group: 'account.sealos.io',
  version: 'v1',
  namespace: 'sealos-system',
  plural: 'payments'
};

export type PaymentResp = {
  payment_name: string;
  extra?: any;
};

export const generatePaymentCrd = (form: PaymentForm) => {
  const paymentCrd = {
    apiVersion: 'account.sealos.io/v1',
    kind: 'Payment',
    metadata: {
      name: form.paymentName,
      namespace: form.namespace
    },
    spec: {
      userID: form.userId,
      amount: form.amount
    }
  };

  try {
    const result = yaml.dump(paymentCrd);
    return result;
  } catch (error) {
    return '';
  }
};

export const MONTHS = dayjs.months();
// years mock data
export const INIT_YEAR = 2022;
export const CURRENT_MONTH = '本月';
export const NOW_YEAR = dayjs().year();
export const NOW_MONTH = dayjs().month();
export const NOW_WEEK = 0;

export const valuationMap = new Map([
  ['cpu', { unit: 'Core', scale: 1000, bg: '#33BABB' }],
  ['memory', { unit: 'GiB', scale: 1024, bg: '#36ADEF' }],
  ['storage', { unit: 'GiB', scale: 1024, bg: '#8172D8' }]
  // ['disk', { unit: 'MiB' }]
]);
