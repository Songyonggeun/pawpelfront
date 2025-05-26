import { Fragment } from 'react';
import { redirect } from 'next/navigation';
export default function NotFound(){
    redirect('/')
    return <Fragment>
        not found
    </Fragment>
}