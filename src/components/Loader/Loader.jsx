import "./Loader.style.css";
import {hourglass} from "ldrs";

const Loader = ({title}) => {

    hourglass.register();

    return (
        <section className="loader-container">

            <l-hourglass
                size="40"
                bg-opacity="0.1"
                speed="1.75"
                color="red"
            ></l-hourglass>

            <p className="loader-title">
                {title}...
            </p>

        </section>
    );
}

export default Loader;