import { Fragment } from 'react';
import { redirect } from 'next/navigation';
export default function NotFound(){
    redirect('/home')
    return <Fragment>
        not found
    </Fragment>
}