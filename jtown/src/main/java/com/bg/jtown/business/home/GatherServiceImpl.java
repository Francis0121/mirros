package com.bg.jtown.business.home;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Comment;
import com.bg.jtown.business.Count;
import com.bg.jtown.business.Event;
import com.bg.jtown.business.Gather;
import com.bg.jtown.business.Participant;
import com.bg.jtown.business.comment.CommentService;
import com.bg.jtown.business.search.GatherFilter;
import com.bg.jtown.redis.Publisher;
import com.bg.jtown.security.Authority;
import com.bg.jtown.security.SummaryUser;
import com.bg.jtown.util.Pagination;

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
	public List<Gather> selectGatherHotProducts(GatherFilter productGatherFilter) {
		return getSqlSession().selectList("gatherMapper.selectGatherHotProducts", productGatherFilter);
	}

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

	/*
	 * (rand.nextInt(9)+1)*2 에 대한 설명 : 10% , 즉 1/10 -> 10개마다 1개의 큰 사각형이 나와야함. 큰게
	 * 연속으로 나오지 않으려면 2개부터 시작이므로 범위는 2 ~ 18 인 짝수
	 */
	@Override
	public List<Gather> mergeProductGatherList(GatherFilter gatherFilter) {
		int hotCount = selectGatherProductsCount(gatherFilter) * 10 / 100 ;
		List<Gather> normalProduct = selectGatherProducts(gatherFilter); 
		Random rand = new Random(System.nanoTime());
		List<Gather> hotProduct = new ArrayList<Gather>();
		List<Gather> eventList = selectEventList(gatherFilter);
		List<Gather> smallSizeList = new ArrayList<Gather>();
		List<Gather> mergeList = new ArrayList<Gather>();
		
		for(int idx = 0; idx < hotCount ; idx++){
			hotProduct.add(normalProduct.remove(idx));
			hotProduct.get(idx).setHot(1);
		}
		if (!"hot".equals(gatherFilter.getNavFlag())) {
			smallSizeList.addAll(eventList);
			smallSizeList.addAll(normalProduct);
			Collections.shuffle(smallSizeList, rand);
		}
		Collections.shuffle(hotProduct, rand);
		
		// TODO IF -> BANNER LIST가 끝날 때까지 먼저 hotproduct 대신에 bannerList를 먼저 비움
		int totalCount = 0;
		totalCount = hotProduct.size() + smallSizeList.size();
		while (totalCount > 0) {
			if (!smallSizeList.isEmpty()) {
				int randNum = ((rand.nextInt(9) + 1) * 2);
				for (int idx = 0; idx < randNum; idx++) {
					int normalSize = smallSizeList.size();
					if (normalSize < randNum) {
						for (int sIdx = 0; sIdx < normalSize; sIdx++) {
							mergeList.add(smallSizeList.remove(0));
							totalCount--;
						}
					} else {
						mergeList.add(smallSizeList.remove(0));
						totalCount--;
					}
				}
			}
			if (!hotProduct.isEmpty()) {
				mergeList.add(hotProduct.remove(0));
				totalCount--;
			}
		}
		
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
	public void insertBannerEventParticipant(Participant participant) {
		getSqlSession().insert("gatherMapper.insertBannerEventParticipant", participant);
	}

	@Override
	public Integer selectExistParticipant(Participant participant) {
		return getSqlSession().selectOne("gatherMapper.selectExistParticipant", participant);
	}

	@Override
	public List<Gather> selectMyHeartList(Integer customerPn) {
		return getSqlSession().selectList("gatherMapper.selectMyHeartList", customerPn);
	}

}
