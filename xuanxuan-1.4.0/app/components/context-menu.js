import React from 'react';
import Display from './display';
import HTML from '../utils/html-helper';
import Icon from './icon';
import timeSequence from '../utils/time-sequence';

/**
 * Show Context menu
 * @param {{x: Number, y: Number}} position
 * @param {Array} menus
 * @param {?Object} props
 * @param {?Function} callback
 */
const show = (position, menus, props = {}, callback = null) => {
    let {
        className,
        onItemClick,
        menuClassName,
        itemClassName,
        content,
        style,
    } = props;

    if (!position) {
        if (DEBUG) {
            throw new Error('Position is not defined to show the popover.');
        }
    }

    if (!props.id) {
        props.id = timeSequence();
    }

    const handleItemClick = (item, idx, e) => {
        let clickResult = null;
        if (onItemClick) {
            clickResult = onItemClick(item, idx, e);
        }
        if (item.click) {
            
            clickResult = item.click(item, idx, e);
            
        }
        if (clickResult !== false) {
            Display.remove(props.id);
        }
    };
    let hasIconLeft = false;
    const itemsView = menus.map((item, idx) => {
        if (typeof item === 'string') {
            if (item === '-' || item === 'divider' || item === 'separator') {
                item = {type: 'divider'};
            } else {
                item = {label: item};
            }
        }
        const {
            id,
            className,
            hidden,
            click,
            render,
            type,
            disabled,
            data,
            ...other
        } = item;
        if (hidden) {
            return null;
        }
        if (render) {
            return render(item);
        } else if (type === 'divider' || type === 'separator') {
            return <div key={id || idx} className={HTML.classes('divider', className)} {...other} />;
        }
        const iconView = item.icon && Icon.render(item.icon, {className: 'item-left-icon'});
        if (iconView) {
            hasIconLeft = true;
        }
        return (<a onClick={handleItemClick.bind(null, item, idx)} key={id || idx} className={HTML.classes('item', itemClassName, className, {disabled})} {...other}>
            {iconView}
            {item.label && <span className="title">{item.label}</span>}
            {item.checked && <Icon name="check" />}
        </a>);
    });
    content = (<div className={HTML.classes('list dropdown-menu', menuClassName, {'has-icon-left': hasIconLeft})}>
        {itemsView}
        {content}
    </div>);

    const x = position.x || 0;
    const y = position.y || 0;
    style = Object.assign({maxWidth: window.innerWidth, maxHeight: window.innerHeight, left: x, top: y}, style);

    className = HTML.classes('contextmenu layer', className);

    props = Object.assign({backdropClassName: 'clean', animation: false}, props, {className, style, content, plugName: 'contextmenu'});
    delete props.menuClassName;
    delete props.itemClassName;
    delete props.onItemClick;

    return Display.show(props, display => {
        const ele = display.displayElement;
        const newX = Math.max(0, Math.min(window.innerWidth - ele.clientWidth, x));
        const newY = Math.max(0, Math.min(window.innerHeight - ele.clientHeight, y));
        if (newX !== x || newY !== y) {
            display.setStyle({top: newY, left: newX, opacity: 1});
        } else {
            display.setStyle({opacity: 1});
        }
    });
};

export default {
    show,
    hide: Display.hide,
    remove: Display.remove
};
