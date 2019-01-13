import Link from 'next/link';
import fetch from 'isomorphic-unfetch';

const Robots=(props)=>{
    console.log(props.robots);
    return(
        <div>
            <h1>Robots</h1>
            <Link href='index'><button>Home</button></Link>
            <Link href='about'><button>About</button></Link>
            <div>
                <ul><h5>Robots data</h5>
                    {props.robots.map(robot=>{
                        return(
                            <li key={robot.id}>
                                <Link href={'./'+robot.id}>
                                    {robot.name}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

Robots.getInitialProps= async ()=>{
    const fetchResult = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await fetchResult.json();
    return{
        robots: data
    }
}

export default Robots;