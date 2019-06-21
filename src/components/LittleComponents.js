import React, { Fragment, useState, useEffect } from 'react';
import 'src/components/littleComponents.scss';

/***
 * 上一步、下一步按钮
 */
export function ArrowButton(props) {
    return <button className={ `sd-arrow-button ${ props.type }` } { ...props }>
        {
            props.type === 'last' ? (
                <Fragment>
                    <span className="icon"/>
                    { props.children }
                </Fragment>
            ) : (
                <Fragment>
                    { props.children }
                    <span className="icon"/>
                </Fragment>
            )
        }
    </button>
}


/***
 * container
 */
export function ContainerBody(props) {
    const { children, style, ...otherProps } = props;
    return (
        <div
            style={ { padding: '0 20px 8px', ...style } }
            { ...otherProps }
        >
            { children }
        </div>
    )
}


/***
 * 组件懒加载
 */
export function LazyLoad(path) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                component: null,
            }
        }

        componentDidMount() {
            path().then(module => this.setState({ component: module.default ? module.default : null }));
        }

        render() {
            const C = this.state.component;
            return C ? <C { ...this.props } /> : null;
        }
    }
}


export function BackToTop(props) {
    if (!props.wrapperId && !props.wrapper) {
        console.error('必须设置"wrapperId"或"wrapper"');
        return;
    }
    const [visible, setVisible] = useState(false);
    const wrapper = document.getElementById(props.wrapperId) || props.wrapper;
    let key = props.wrapperId;
    if (!key) { // 没有id则用随机数
        key = Math.random().toString(36).substring(7).split('').join('.');
    }
    useEffect(() => {
        if (!wrapper) {
            console.error('element不存在,请检查Id是否存在且正确');
            return;
        }
        wrapper.onscroll = () => {
            setVisible(wrapper.scrollTop > 100);
        }
    });
    const backToTop = () => {
        const speed = wrapper.scrollTop / 10;
        const interval = setInterval(() => {
            if (wrapper.scrollTop > 0) {
                wrapper.scrollTop -= speed;
            } else {
                clearInterval(interval);
            }
        }, 20);
    };
    return (
        <img
            key={ key }
            alt="pic"
            style={ {
                position: 'fixed',
                right: '20px',
                bottom: '20px',
                zIndex: '1100',
                opacity: visible ? 1 : 0,
            } }
            src={ require('src/assets/images/icon_to_top.png') }
            onClick={ backToTop }
        />
    );
}