package com.bg.jtown.business.home;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Count;
import com.bg.jtown.business.Gather;
import com.bg.jtown.business.search.GatherFilter;
import com.bg.jtown.redis.Publisher;
import com.bg.jtown.security.Authority;
import com.bg.jtown.security.SummaryUser;
import com.bg.jtown.util.Pagination;

@Service
public class GatherServiceImpl extends SqlSessionDaoSupport implements GatherService {

	@Resource
	private Publisher publisher;

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
	public List<Gather> mergeProductGatherList(GatherFilter productGatherFilter) {
		int count = selectGatherProductsCount(productGatherFilter);
		productGatherFilter.setPercentCount(count * 10 / 100);
		Random rand = new Random(System.nanoTime());
		List<Gather> hotProduct = selectGatherHotProducts(productGatherFilter);
		List<Gather> eventList = selectEventList(productGatherFilter);
		List<Gather> normalProduct = selectGatherProducts(productGatherFilter);

		List<Gather> smallSizeList = new ArrayList<Gather>();
		smallSizeList.addAll(normalProduct);
		smallSizeList.addAll(eventList);

		Collections.shuffle(smallSizeList, rand);
		Collections.shuffle(hotProduct, rand);
		List<Gather> mergeList = new ArrayList<Gather>();

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

}
