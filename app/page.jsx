import { Fragment } from 'react';
import { redirect } from 'next/navigation';
export default function DefaultPage(){
    redirect('/home')
    return <Fragment>
    </Fragment>
}