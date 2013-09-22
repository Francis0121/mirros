package com.bg.jtown.business.home;

import java.util.List;

import com.bg.jtown.business.ProductGather;
import com.bg.jtown.business.search.ProductGatherFilter;

public interface ProductGatherService {

	List<ProductGather> selectGatherHotProducts(ProductGatherFilter gatherFilter);

	List<ProductGather> selectGatherProducts(ProductGatherFilter gatherFilter);

	int selectGatherProductsCount(ProductGatherFilter gatherFilter);

	List<ProductGather> mergeProductGatherList(ProductGatherFilter productGatherFilter);
	
	List<ProductGather> paginateItemList(List<ProductGather> itemList, ProductGatherFilter productGatherFilter);
}
