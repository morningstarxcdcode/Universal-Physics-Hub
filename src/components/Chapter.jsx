// src/components/Chapter.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom"
import Tag from "./Tag.jsx"
import PropTypes from "prop-types"

function Chapter(props) {
    return(
    <section id={props.id} className="chapter-card magnetic-card tilt-card reveal-element">
            <div className='chapter-card-overlay'>
                <div className="chapter-card-tags-container">
                    {props.tags.map((tag, idx) => (
                        <Tag level={tag} key={tag.id || idx} />
                    ))}
                </div>
        <h2 className="magnetic-text">Chapter {props.id}: {props.name}</h2>
                <p>{props.desc}</p>
        <Link to={props.link} className="ripple-effect">Go to simulation
                    <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '10px' }}/>
                </Link>
            </div>
            <div className="chapter-card-stroke"/>
        </section>
    );
}

export default Chapter

Chapter.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    desc: PropTypes.string,
    link: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
    })).isRequired,
}

Chapter.defaultProps = {
    desc: "",
}