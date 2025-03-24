import { Suspense } from 'react';
import ViewActivityLogById from './ViewActivityLogById';
import Loader from '@/component/common/loader/Loader';
import Layout from '@/layouts/Layout';

export default function Page({ params }) {
  return (
    <Suspense fallback={<div><Loader/></div>}>
      <Layout>
      <ViewActivityLogById id={params.id} />
      </Layout>
    </Suspense>
  );
}