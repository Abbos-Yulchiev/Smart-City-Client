import React from 'react'

const NoMatch = () => {
    return (
        <div style={{
            width: '100vw',
            height: '90vh',
            backgroundImage: `url("https://images.pexels.com/photos/6037808/pexels-photo-6037808.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}
        >
            <p style={{
                color: "black",
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'center',
                height: '3vh',
                fontSize: 20
            }}
            >Go to
                <a href={"/"}> Main Page</a>
            </p>
            <h1>404. Page not found</h1>
        </div>
    )
}
export default NoMatch;