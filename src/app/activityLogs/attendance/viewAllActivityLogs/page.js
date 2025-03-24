import React, { Suspense } from 'react'
import ActivityLogs from './ViewAllActivityLogs';
import Loader from '@/component/common/loader/Loader';
import Layout from '@/layouts/Layout';

const page = () => {
   return (
        <Suspense fallback={<div><Loader/></div>}>
          <Layout>
          <ActivityLogs/>
          </Layout>
        </Suspense>
      );
}

export default page