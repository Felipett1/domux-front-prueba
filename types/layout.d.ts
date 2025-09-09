/* Context Types */
export type LayoutState = {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
};

export interface MenuModel {
    label: string;
    icon?: string;
    items?: MenuModel[];
    to?: string;
    url?: string;
    target?: HTMLAttributeAnchorTarget;
    seperator?: boolean;
}

export interface AppMenuItem extends MenuModel {
    items?: AppMenuItem[];
    badge?: 'UPDATED' | 'NEW';
    badgeClass?: string;
    class?: string;
    preventExact?: boolean;
    visible?: boolean;
    disabled?: boolean;
    replaceUrl?: boolean;
    command?: ({ originalEvent, item }: CommandProps) => void;
}

export interface AppMenuItemProps {
    item?: AppMenuItem;
    parentKey?: string;
    index?: number;
    root?: boolean;
    className?: string;
}
