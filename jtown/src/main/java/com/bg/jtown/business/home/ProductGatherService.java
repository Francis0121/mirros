package com.bg.jtown.business.home;

import java.util.List;

import javax.servlet.http.HttpSession;

import com.bg.jtown.business.Count;
import com.bg.jtown.business.ProductGather;
import com.bg.jtown.business.search.ProductGatherFilter;
import com.bg.jtown.security.SummaryUser;

public interface ProductGatherService {

	List<ProductGather> selectGatherHotProducts(ProductGatherFilter gatherFilter);

	List<ProductGather> selectGatherProducts(ProductGatherFilter gatherFilter);

	int selectGatherProductsCount(ProductGatherFilter gatherFilter);

	List<ProductGather> mergeProductGatherList(ProductGatherFilter productGatherFilter);

	List<ProductGather> paginateItemList(List<ProductGather> itemList, ProductGatherFilter productGatherFilter);

	void insertProductStasticView(Integer productPn);

	void updateProductStasticView(Count count);

	void insertUpdateProductStasticView(Count count);
	
	Integer selectProductStasticViewTodayCount(Integer productPn);
	
	List<ProductGather> selectEventList(ProductGatherFilter gatherFilter);	
}
