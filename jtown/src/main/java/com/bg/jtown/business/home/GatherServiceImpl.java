package com.bg.jtown.business.home;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

import javax.annotation.Resource;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.Count;
import com.bg.jtown.business.Event;
import com.bg.jtown.business.Gather;
import com.bg.jtown.business.Participant;
import com.bg.jtown.business.comment.CommentService;
import com.bg.jtown.business.search.BannerFilter;
import com.bg.jtown.business.search.GatherFilter;
import com.bg.jtown.redis.Publisher;
import com.bg.jtown.util.DateUtil;

/**
 * @author In Sanghak
 * 
 */
@Service
public class GatherServiceImpl extends SqlSessionDaoSupport implements GatherService {

	@Resource
	private Publisher publisher;

	@Autowired
	private CommentService commentService;

	@Override
	public List<Gather> selectGatherProducts(GatherFilter productGatherFilter) {
		return getSqlSession().selectList("gatherMapper.selectGatherProducts", productGatherFilter);
	}

	@Override
	public int selectGatherProductsCount(GatherFilter productGatherFilter) {
		return getSqlSession().selectOne("gatherMapper.selectGatherProductsCount", productGatherFilter);
	}

	@Override
	public List<Gather> paginateItemList(List<Gather> itemList, GatherFilter productGatherFilter) {
		List<Gather> paginatedItemList = new ArrayList<Gather>();
		int itemSize = itemList.size();
		for (int idx = 0; idx < productGatherFilter.getPagePerItem() * productGatherFilter.getCurrentPage(); idx++) {
			if (idx < itemSize) {
				Comment comment = new Comment();
				comment.setProductPn(itemList.get(idx).getProductPn());
				comment.setPage(1);
				if (comment.getProductPn() != 0) {
					itemList.get(idx).setComments(commentService.selectCommentList(comment));
				} else {
					comment.setEventPn(itemList.get(idx).getEventPn());
					itemList.get(idx).setComments(commentService.selectEventCommentList(comment));
				}
				paginatedItemList.add(itemList.get(idx));
			}
		}
		return paginatedItemList;
	}

	@Override
	public List<Gather> paginateHotItemList(List<Gather> itemList, GatherFilter productGatherFilter) {
		List<Gather> paginatedItemList = new ArrayList<Gather>();
		int itemSize = itemList.size();
		for (int idx = productGatherFilter.getPagePerItem() * (productGatherFilter.getCurrentPage() - 1); idx < productGatherFilter.getPagePerItem()
				* productGatherFilter.getCurrentPage(); idx++) {
			if (idx < itemSize) {
				Comment comment = new Comment();
				comment.setProductPn(itemList.get(idx).getProductPn());
				comment.setPage(1);
				if (comment.getProductPn() != 0) {
					itemList.get(idx).setComments(commentService.selectCommentList(comment));
				} else {
					comment.setEventPn(itemList.get(idx).getEventPn());
					itemList.get(idx).setComments(commentService.selectEventCommentList(comment));
				}
				paginatedItemList.add(itemList.get(idx));
			}
		}
		return paginatedItemList;
	}

	@Override
	public List<Gather> selectNewProductList(GatherFilter gatherFilter) {
		return getSqlSession().selectList("gatherMapper.selectNewProductList", gatherFilter);
	}

	@Override
	public List<Gather> selectHotProductList(GatherFilter gatherFilter) {
		return getSqlSession().selectList("gatherMapper.selectHotProductList", gatherFilter);
	}

	@Override
	public List<Gather> selectNewMergeList(GatherFilter gatherFilter) {
		List<Gather> mergeList = new ArrayList<Gather>();
		Random rand = new Random(System.nanoTime());
		List<Gather> itemList = selectNewProductList(gatherFilter);
		GatherFilter eventFilter = gatherFilter;
		eventFilter.setPagePerItem(3);
		List<Gather> eventList = new ArrayList<Gather>();
		if (gatherFilter.getItemName() == null) {
			eventList = selectEventList(eventFilter);
		}

		int totalCount = 0;
		totalCount = eventList.size() + itemList.size();
		while (totalCount > 0) {
			if (!itemList.isEmpty()) {
				int randNum = rand.nextInt(7) + 1;
				for (int idx = 0; idx < randNum; idx++) {
					int normalSize = itemList.size();
					if (normalSize < randNum) {
						for (int sIdx = 0; sIdx < normalSize; sIdx++) {
							mergeList.add(itemList.remove(0));
							totalCount--;
						}
					} else {
						mergeList.add(itemList.remove(0));
						totalCount--;
					}
				}
			}
			if (!eventList.isEmpty()) {
				mergeList.add(eventList.remove(0));
				totalCount--;
			}
		}
		gatherFilter.setPagePerItem(23);
		return mergeList;
	}

	@Override
	public List<Gather> mergeProductGatherList(GatherFilter gatherFilter) {
		int hotCount = selectGatherProductsCount(gatherFilter) * 10 / 100;
		List<Gather> normalProduct = selectGatherProducts(gatherFilter);
		Random rand = new Random(System.nanoTime());
		List<Gather> hotProduct = new ArrayList<Gather>();
		List<Gather> eventList = selectEventList(gatherFilter);
		List<Gather> smallSizeList = new ArrayList<Gather>();
		List<Gather> mergeList = new ArrayList<Gather>();

		for (int idx = 0; idx < hotCount; idx++) {
			hotProduct.add(normalProduct.remove(idx));
			hotProduct.get(idx).setHot(1);
		}
		if (!"hot".equals(gatherFilter.getNavFlag())) {
			if (gatherFilter.getItemName() == null) {
				smallSizeList.addAll(eventList);
			}
			smallSizeList.addAll(normalProduct);
			Collections.shuffle(smallSizeList, rand);
		}
		Collections.shuffle(hotProduct, rand);
		mergeList.addAll(hotProduct);
		mergeList.addAll(smallSizeList);
		return mergeList;
	}

	@Override
	public void insertProductStasticView(Integer productPn) {
		getSqlSession().insert("gatherMapper.insertProductStasticView", productPn);
	}

	@Override
	public void updateProductStasticView(Count count) {
		getSqlSession().update("gatherMapper.updateProductStasticView", count);
	}

	@Override
	public Integer selectProductStasticViewTodayCount(Integer productPn) {
		return getSqlSession().selectOne("gatherMapper.selectProductStasticViewTodayCount", productPn);
	}

	@Override
	public void insertUpdateProductStasticView(Count count) {
		Integer dayCount = selectProductStasticViewTodayCount(count.getProductPn());

		if (dayCount == null || dayCount == 0) {
			insertProductStasticView(count.getProductPn());
		} else {
			count.setCount(dayCount + 1);
			updateProductStasticView(count);
		}
	}

	@Override
	public List<Gather> selectEventList(GatherFilter gatherFilter) {
		return getSqlSession().selectList("gatherMapper.selectEventList", gatherFilter);
	}

	@Override
	public void insertEventStasticView(Integer eventPn) {
		getSqlSession().insert("gatherMapper.insertEventStasticView", eventPn);
	}

	@Override
	public void updateEventStasticView(Count count) {
		getSqlSession().update("gatherMapper.updateEventStasticView", count);

	}

	@Override
	public void insertUpdateEventStasticView(Count count) {
		Integer dayCount = selectEventStasticViewTodayCount(count.getEventPn());

		if (dayCount == null || dayCount == 0) {
			insertEventStasticView(count.getEventPn());
		} else {
			count.setCount(dayCount + 1);
			updateEventStasticView(count);
		}

	}

	@Override
	public Integer selectEventStasticViewTodayCount(Integer eventPn) {
		return getSqlSession().selectOne("gatherMapper.selectEventStasticViewTodayCount", eventPn);
	}

	@Override
	public Integer selectProductHeartCountForCustomer(Count count) {
		return getSqlSession().selectOne("gatherMapper.selectProductHeartCountForCustomer", count);
	}

	@Override
	public Integer selectProductHeartCount(Count count) {
		return getSqlSession().selectOne("gatherMapper.selectProductHeartCount", count);
	}

	@Override
	public void insertProductHeart(Count count) {
		getSqlSession().insert("gatherMapper.insertProductHeart", count);
	}

	@Override
	public void deleteProductHeart(Count count) {
		getSqlSession().delete("gatherMapper.deleteProductHeart", count);
	}

	@Override
	public void insertProductHeartCount(Count count) {
		Integer heartCount = selectProductHeartCountForCustomer(count);
		if (heartCount == 0) {
			count.setCrudType("productHeartInsert");
			insertProductHeart(count);
		} else {
			count.setCrudType("productHeartDelete");
			deleteProductHeart(count);
		}
		count.setCount(selectProductHeartCount(count));
		publisher.productHeartPublish(count);
	}

	@Override
	public Integer selectEventHeartCountForCustomer(Count count) {
		return getSqlSession().selectOne("gatherMapper.selectEventHeartCountForCustomer", count);
	}

	@Override
	public Integer selectEventHeartCount(Count count) {
		return getSqlSession().selectOne("gatherMapper.selectEventHeartCount", count);
	}

	@Override
	public void insertEventHeart(Count count) {
		getSqlSession().insert("gatherMapper.insertEventHeart", count);
	}

	@Override
	public void deleteEventHeart(Count count) {
		getSqlSession().delete("gatherMapper.deleteEventHeart", count);
	}

	@Override
	public void insertEventHeartCount(Count count) {
		Integer heartCount = selectEventHeartCountForCustomer(count);
		if (heartCount == 0) {
			count.setCrudType("eventHeartInsert");
			insertEventHeart(count);
		} else {
			count.setCrudType("eventHeartDelete");
			deleteEventHeart(count);
		}
		count.setCount(selectEventHeartCount(count));
		publisher.eventHeartPublish(count);
	}

	@Override
	public Gather selectShopEvent(Integer eventPn) {
		return getSqlSession().selectOne("gatherMapper.selectShopEvent", eventPn);
	}

	@Override
	public Event selectBannerEvent(Event event) {
		return getSqlSession().selectOne("gatherMapper.selectBannerEvent", event);
	}

	@Override
	public List<Event> selectBannerEventList() {
		return getSqlSession().selectList("gatherMapper.selectBannerEventList");
	}
	
	@Override
	public List<Event> selectBannerEventList(BannerFilter bannerFilter) {
		return getSqlSession().selectList("gatherMapper.selectBannerEventListPaging", bannerFilter);
	}

	@Override
	public void insertBannerEventParticipant(Participant participant) {
		getSqlSession().insert("gatherMapper.insertBannerEventParticipant", participant);
	}

	@Override
	public Integer selectExistParticipant(Participant participant) {
		return getSqlSession().selectOne("gatherMapper.selectExistParticipant", participant);
	}

	@Override
	public List<Gather> selectMyHeartList(Integer customerPn) {
		List<Gather> lists = getSqlSession().selectList("gatherMapper.selectMyHeartList", customerPn);
		for (int idx = 0, size = lists.size(); idx < size; idx++) {
			lists.get(idx).setComparedTime(DateUtil.beforeRecodeTimeToString(lists.get(idx).getInputDate()));
		}
		return lists;
	}

	// ~ App

}
