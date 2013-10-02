package com.bg.jtown.business.home;

import java.util.List;

import javax.servlet.http.HttpSession;

import com.bg.jtown.business.Count;
import com.bg.jtown.business.Gather;
import com.bg.jtown.business.search.GatherFilter;
import com.bg.jtown.security.SummaryUser;

public interface GatherService {

	List<Gather> selectGatherHotProducts(GatherFilter gatherFilter);

	List<Gather> selectGatherProducts(GatherFilter gatherFilter);

	int selectGatherProductsCount(GatherFilter gatherFilter);

	List<Gather> mergeProductGatherList(GatherFilter productGatherFilter);

	List<Gather> paginateItemList(List<Gather> itemList, GatherFilter productGatherFilter);

	void insertProductStasticView(Integer productPn);

	void updateProductStasticView(Count count);

	void insertUpdateProductStasticView(Count count);
	
	Integer selectProductStasticViewTodayCount(Integer productPn);
	
	List<Gather> selectEventList(GatherFilter gatherFilter);
	
	void insertEventStasticView(Integer eventPn);

	void updateEventStasticView(Count count);

	void insertUpdateEventStasticView(Count count);
	
	Integer selectEventStasticViewTodayCount(Integer eventPn);
	
	Integer selectProductHeartCount(Count count);
	
	Integer selectProductHeartCountForCustomer(Count count);
	
	void insertProductHeartCount(Count count);
	
	void insertProductHeart(Count count);
	
	void deleteProductHeart(Count count);
}
