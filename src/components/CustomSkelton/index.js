import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

const CustomSkelton = ({
    height = 30,
    width = 100,
}) => {
    return (
        <>
            <SkeletonTheme height={height} width={width} baseColor="#665aa6" highlightColor="#D0CDE5">
                <p>
                    <Skeleton />
                </p>
            </SkeletonTheme>
        </>
    )
}

export default CustomSkelton;