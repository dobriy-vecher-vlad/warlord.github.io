import React from 'react';
import {
	Spacing,
	Panel,
	Group,
	CardGrid,
	Card,
	Cell,
	HorizontalScroll,
	TabsItem,
	Tabs,
	InfoRow,
	Spinner
} from '@vkontakte/vkui';
import InfiniteScroll from "react-infinite-scroll-component";
import { Icon28CoinsOutline, Icon28DiamondOutline, Icon28GiftOutline, Icon28StatisticsOutline } from '@vkontakte/icons';

import Items from '../../data/items.json';

class PANEL extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			snackbar: null,
			tabs: 1,
			mode: { yesStock: true, noStock: true },
			items: this.props.syncItems,
			currentItems: null,
			allItems: null,
			stats: [0, 0, 0, 0, 0, 0]
		};
		this.Scroll = React.createRef();
	};
	async updateItems() {
		if (this.Scroll && this.Scroll.current) this.Scroll.current.scrollTo({ top: 0 });
		if (!this.props.state.isDesktop) document.querySelector('html').scrollTo({ top: 0 });
		let allItems = this.state.tabs == 1 ? Items : Items.filter(item => item.type == this.state.tabs);
		for (let item of allItems) {
			let find = this.state.items.find(i => i.id == item.id);
			if (find) {
				item.bought = true;
				item.lvl = find.lvl;
				item.bonus = find.bonus;
				item.stones = find.stones;
			} else {
				item.bought = false;
			}
		}
		allItems = allItems.filter(item => item.bought == true);
		allItems.sort(function(a, b) {
			if (b.lvl < a.lvl) return -1;
			if (b.lvl > a.lvl) return 1;
			if (b.bonus[0]+b.bonus[1]+b.bonus[2]*15 < a.bonus[0]+a.bonus[1]+a.bonus[2]*15) return -1;
			if (b.bonus[0]+b.bonus[1]+b.bonus[2]*15 > a.bonus[0]+a.bonus[1]+a.bonus[2]*15) return 1;
		});
		this.setState({ currentItems: allItems.slice(0, 24), allItems, stats: [
			allItems.length,
			allItems.length&&allItems.map(item => item.stones.map((stone) => stone[0] == 0 ? 0 : 1).reduce((x, y) => x + y)).reduce((x, y) => x + y),
			allItems.length&&allItems.map(item => item.lvl).reduce((x, y) => x + y),
			allItems.length&&allItems.map(item => item.bonus[0]).reduce((x, y) => x + y),
			allItems.length&&allItems.map(item => item.bonus[2]).reduce((x, y) => x + y),
			allItems.length&&allItems.map(item => item.bonus[1]).reduce((x, y) => x + y)
		] });
	};
	async componentDidMount() {
		console.log('[PANEL] >', this.props.id);
		!this.props.state.isDesktop && this.props.options.updateFixedLayout();
		await this.updateItems();
	};
	async componentDidUpdate() {
		!this.props.state.isDesktop && this.props.options.updateFixedLayout();
	};
	async shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.state.snackbar!=this.state.snackbar&&nextState.snackbar==this.state.snackbar) this.setState({ snackbar: nextProps.state.snackbar });
		if (nextState.snackbar!=this.state.snackbar) return true;
		return false;
	}
	render() {
		const { state, options, parent } = this.props;
		const { currentItems, allItems, stats } = this.state;
		const pathImages = 'https://dobriy-vecher-vlad.github.io/warlord/wiki-new/media/images/';
		const title = 'Инкрустация';
		const description = 'Мой профиль';
		const avatar = 'labels/31.png';
		return (
			<Panel id={this.props.id}>
				{!state.isDesktop && options.getPanelHeader(title, description, avatar, this.props.id, parent)}
				<Group>
					<div className='Sticky Sticky__top withSeparator'>
						{state.isDesktop && options.getPanelHeader(title, description, avatar, this.props.id, parent)}
						<Tabs mode="default">
							<HorizontalScroll getScrollToLeft={i => i - 240} getScrollToRight={i => i + 240}>
								<TabsItem onClick={() => this.setState({ tabs: 1 }, this.updateItems)} selected={this.state.tabs === 1}>Все</TabsItem>
								<TabsItem onClick={() => this.setState({ tabs: 2 }, this.updateItems)} selected={this.state.tabs === 2}>Оружие</TabsItem>
								<TabsItem onClick={() => this.setState({ tabs: 4 }, this.updateItems)} selected={this.state.tabs === 4}>Шлемы</TabsItem>
								<TabsItem onClick={() => this.setState({ tabs: 3 }, this.updateItems)} selected={this.state.tabs === 3}>Броня</TabsItem>
								<TabsItem onClick={() => this.setState({ tabs: 12 }, this.updateItems)} selected={this.state.tabs === 12}>Наплечники</TabsItem>
								<TabsItem onClick={() => this.setState({ tabs: 6 }, this.updateItems)} selected={this.state.tabs === 6}>Наручи</TabsItem>
								<TabsItem onClick={() => this.setState({ tabs: 14 }, this.updateItems)} selected={this.state.tabs === 14}>Перчатки</TabsItem>
								<TabsItem onClick={() => this.setState({ tabs: 5 }, this.updateItems)} selected={this.state.tabs === 5}>Штаны</TabsItem>
								<TabsItem onClick={() => this.setState({ tabs: 13 }, this.updateItems)} selected={this.state.tabs === 13}>Ботинки</TabsItem>
								<TabsItem onClick={() => this.setState({ tabs: 15 }, this.updateItems)} selected={this.state.tabs === 15}>Щиты</TabsItem>
								<TabsItem onClick={() => this.setState({ tabs: 16 }, this.updateItems)} selected={this.state.tabs === 16}>Бижутерия</TabsItem>
							</HorizontalScroll>
						</Tabs>
						<Spacing size={16} separator style={{padding: 0, margin: state.isDesktop ? '0 -7px' : ''}}/>
						<CardGrid size={state.isDesktop ? "s" : "m"}>
							<Card className="beautifulCard" mode="outline">
								<InfoRow header={`${options.numberForm(stats[0], ['Куплена', 'Куплены', 'Куплено'])}`}>{options.numberSpaces(stats[0])} {options.numberForm(stats[0], ['вещь', 'вещи', 'вещей'])}</InfoRow>
								<Icon28CoinsOutline/>
							</Card>
							<Card className="beautifulCard" mode="outline">
								<InfoRow header={`${options.numberForm(stats[1], ['Вставлен', 'Вставлено', 'Вставлено'])}`}>{options.numberSpaces(stats[1])} {options.numberForm(stats[1], ['камень', 'камня', 'камней'])}</InfoRow>
								<Icon28DiamondOutline/>
							</Card>
							<Card className="beautifulCard" mode="outline">
								<InfoRow header={`${options.numberForm(stats[2], ['Улучшен', 'Улучшено', 'Улучшено'])}`}>{options.numberSpaces(stats[2])} {options.numberForm(stats[2], ['уровень', 'уровня', 'уровней'])}</InfoRow>
								<Icon28StatisticsOutline/>
							</Card>
							<Card className="beautifulCard" mode="outline">
								<InfoRow header={`Бонус от камней`}>{options.numberSpaces(stats[3])} {options.numberForm(stats[3], ['урон', 'урона', 'урона'])}</InfoRow>
								<Icon28GiftOutline/>
							</Card>
							<Card className="beautifulCard" mode="outline">
								<InfoRow header={`Бонус от камней`}>{options.numberSpaces(stats[4]*15)} {options.numberForm(stats[4]*15, ['здоровье', 'здоровья', 'здоровья'])}</InfoRow>
								<Icon28GiftOutline/>
							</Card>
							<Card className="beautifulCard" mode="outline">
								<InfoRow header={`Бонус от камней`}>{options.numberSpaces(stats[5])} {options.numberForm(stats[5], ['энергия', 'энергии', 'энергии'])}</InfoRow>
								<Icon28GiftOutline/>
							</Card>
						</CardGrid>
						<Spacing size={8} />
					</div>
					{currentItems && currentItems.length > 0 ? <div ref={this.Scroll} className="Scroll" id="Scroll" style={{maxHeight: state.isDesktop ? '420px' : 'unset'}}>
						<InfiniteScroll
							dataLength={currentItems.length}
							next={() => this.setState((state) => ({
								currentItems: state.currentItems.concat(allItems.slice(state.currentItems.length, state.currentItems.length+24))
							}))}
							hasMore={allItems.length > currentItems.length}
							loader={<Spinner size="regular" style={{ margin: '20px 0' }} />}
							scrollableTarget={state.isDesktop?"Scroll":false}
						><CardGrid size={state.isDesktop ? "s" : "m"}>
							{currentItems.map((data, x) => options.getItemPreview(data, x, true, false, false, true))}
						</CardGrid></InfiniteScroll>
					</div>:<Cell className="DescriptionWiki" style={{textAlign: 'center'}} description="Нет предметов"></Cell>}
				</Group>
				{this.state.snackbar}
			</Panel>
		);
	};
};
export default PANEL;