package com.bg.jtown.business.home;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import javax.annotation.Resource;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.ProductGather;
import com.bg.jtown.business.search.ProductGatherFilter;
import com.bg.jtown.redis.Publisher;
import com.bg.jtown.util.Pagination;

@Service
public class ProductGatherServiceImpl extends SqlSessionDaoSupport implements ProductGatherService {

	@Resource
	private Publisher publisher;

	@Override
	public List<ProductGather> selectGatherHotProducts(ProductGatherFilter productGatherFilter) {
		return getSqlSession().selectList("productGatherMapper.selectGatherHotProducts", productGatherFilter);
	}

	@Override
	public List<ProductGather> selectGatherProducts(ProductGatherFilter productGatherFilter) {
		return getSqlSession().selectList("productGatherMapper.selectGatherProducts", productGatherFilter);
	}

	@Override
	public int selectGatherProductsCount(ProductGatherFilter productGatherFilter) {
		return getSqlSession().selectOne("productGatherMapper.selectGatherProductsCount", productGatherFilter);
	}

	@Override
	public List<ProductGather> paginateItemList(List<ProductGather> itemList, ProductGatherFilter productGatherFilter) {
		List<ProductGather> paginatedItemList = new ArrayList<ProductGather>();
		for (int idx = productGatherFilter.getPagePerItem() * (productGatherFilter.getCurrentPage() - 1); idx < productGatherFilter.getPagePerItem()
				* productGatherFilter.getCurrentPage(); idx++) {
			paginatedItemList.add(itemList.get(idx));
		}
		return paginatedItemList;
	}

	/*
	 * (rand.nextInt(5)+1)*2 에 대한 설명 : 15% , 즉 3/20 -> 6.67개마다 1개의 큰 사각형이 나와야함.
	 * 큰 사각형은 hot 아이템이므로 화면에 많이 나타나야함. 그러므로 내림하여 평균적으로 작은 사각형 6개 마다 큰 사각형 1개가
	 * 나와야됨. 큰게 연속으로 나오지 않으려면 2개부터 시작이므로 범위는 2 ~ 10 인 짝수
	 */
	@Override
	public List<ProductGather> mergeProductGatherList(ProductGatherFilter productGatherFilter) {
		int count = selectGatherProductsCount(productGatherFilter);
		productGatherFilter.setPercentCount(count * 15 / 100);
		Random rand = new Random(System.nanoTime());
		List<ProductGather> hotProduct = selectGatherHotProducts(productGatherFilter);
		Collections.shuffle(hotProduct, rand);
		List<ProductGather> normalProduct = selectGatherProducts(productGatherFilter);
		Collections.shuffle(normalProduct, rand);
		List<ProductGather> mergeList = new ArrayList<ProductGather>();

		// TODO IF -> BANNER BANNER LIST가 끝날 때까지 먼저 hotproduct 대신에 bannerList를
		// 먼저 비움
		int totalCount = 0;
		totalCount = hotProduct.size() + normalProduct.size();
		while (totalCount > 0) {
			if (!normalProduct.isEmpty()) {
				int randNum = ((rand.nextInt(5) + 1) * 2);
				for (int idx = 0; idx < randNum; idx++) {
					int normalSize = normalProduct.size();
					if (normalSize < randNum) {
						for (int sIdx = 0; sIdx < normalSize; sIdx++) {
							mergeList.add(normalProduct.remove(0));
							totalCount--;
						}
					} else {
						mergeList.add(normalProduct.remove(0));
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

}
