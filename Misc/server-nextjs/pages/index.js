import Link from 'next/link';

const Index=()=>{
    return(
        <div>
            <h1>SRR Magician</h1>
            <Link href='/about'><button>About</button></Link>
            <br/>
            <Link href='/robots'><button>Robots</button></Link>
        </div>
    )
}

export default Index;