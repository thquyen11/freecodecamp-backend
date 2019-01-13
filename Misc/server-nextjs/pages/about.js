import Image from '../components/images';
import Link from 'next/link';

const About=()=>{
    return(
        <div>
            <h1>About</h1>
            <Link href='index'><button>Home</button></Link>
            <br/>
            <Image/>
        </div>
    )
}

export default About;