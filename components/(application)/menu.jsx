import react, {Fragment} from 'react';

export default function menuComponents({ data = [{title:'제목'}] }) {
    return <Fragment>
        {
            data.map((v,i)=>(
                <li key={i}>
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                        {v.title}
                    </button>
                </li>
            ))
        }
    </Fragment>
}