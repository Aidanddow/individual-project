
/*
 * ShowDiff
 *
 * @param {diff[]} diffArray - an array of diff objects
 */
let ShowDiff = ( {diffArray} ) => {
    return (
        <ul className="diff-list">

            {diffArray.map( (diffFile, index) => (
                <li key={index}>

                    <ul className="diff-list" id="file-diff-list">
                        <h5>{diffFile.new_path}</h5>

                        {diffFile.diff.split("\n").map( 
                            (diffLine) => (
                                <li className={(diffLine.startsWith("+") ? "diff-addition" : 
                                                diffLine.startsWith("-") ? "diff-deletion" : "")}>
                                    {diffLine} 
                                </li>
                            ))}
                    </ul>
                    <br/>
                </li>
            ))}

        </ul>
    )
}

export default ShowDiff