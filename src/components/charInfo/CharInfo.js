import { Component } from 'react';
import './charInfo.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import propTypes from 'prop-types';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }
    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar()
        }
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }


    updateChar = () => {
        const { charId } = this.props;
        if (!charId) {
            return;
        }

        this.onCharLoading();

        this.marvelService
            .getCharacters(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)

    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false,
            error: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }



    render() {
        const { char, loading, error } = this.state
        const skeleton = char || loading || error ? null : <Skeleton />
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error || !char) ? <View char={char} /> : null;
        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }

}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char
    const notImage = thumbnail.indexOf('image_not_available') > -1;
    const comicsList = comics.length > 0 ? <Comics comics={comics} /> : "This character dosn't have comics";
    return (
        <>
            <div className="char__basics">
                <img style={{ objectFit: notImage ? 'contain' : null }} src={thumbnail} alt={name} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">Homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            {comicsList}
        </>
    )
}

const Comics = ({ comics }) => {
    const sliceComics = comics.slice(0, 10);
    return (
        <>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {
                    sliceComics.map((item, i) => {
                        return (<li key={i} className="char__comics-item">
                            {item.name}
                        </li>)
                    })}
            </ul>
        </>
    )
}


CharInfo.propTypes = {
    charId: propTypes.number
}

export default CharInfo;