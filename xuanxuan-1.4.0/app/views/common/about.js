import React, {Component, PropTypes} from 'react';
import Config from 'Config';
import HTML from '../../utils/html-helper';
import Lang from '../../lang';
import {BuildInfo} from '../common/build-info';
import replaceViews from '../replace-views';

class About extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    static defaultProps = {
        className: null,
    };

    static get About() {
        return replaceViews('common/about', About);
    }

    render() {
        const {
            className,
            ...other
        } = this.props;

        return (<div
            {...other}
            className={HTML.classes('app-about center-content space', className)}
        >
            <section className="text-center">
                <img src={`${Config.media['image.path']}logo.png`} alt="logo" />
                <BuildInfo className="space-sm" />
                <div className="space-xl"><a target="_blank" className="btn rounded text-primary strong" href='http://10.20.10.142/12shi'><strong>http://10.20.10.142/12shi</strong></a></div>
                <div><a target="_blank" className="btn rounded" href="http://10.20.10.142/12shi">心有梦想 肩有担当</a></div>
                {/* <div><a target="_blank" className="btn rounded" href="#">{'版权所有 2018 航天一院十所'}</a></div> */}
                <div>{'版权所有©️ 2018 航天一院十所'}</div>
                <div><a target="_blank" className="btn rounded" href="http://emojione.com/">Emoji provided free by EmojiOne</a></div>
            </section>
        </div>);
    }
}

export default About;
