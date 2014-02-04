package com.bg.jtown.business.naturallanguage;

import java.util.ArrayList;
import java.util.List;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Interest;
import com.bg.jtown.business.search.NaturalLanguageFilter;
import com.bg.jtown.security.JtownUser;
import com.bg.jtown.util.Pagination;

/**
 * 자연어 검색 방식
 * 
 * @author Francis
 * 
 */
@Service
public class NaturalLanguageServiceImpl extends SqlSessionDaoSupport implements NaturalLanguageService {

	@Override
	public List<JtownUser> selectSearchShopName(NaturalLanguageFilter naturalLanguageFilter) {
		Pagination pagination = naturalLanguageFilter.getPagination();
		int count = selectSearchShopNameCount(naturalLanguageFilter);
		pagination.setNumItems(count);
		if (count == 0) {
			return new ArrayList<JtownUser>();
		}
		return getSqlSession().selectList("naturalLanguageMapper.selectSearchShopName", naturalLanguageFilter);
	}

	private int selectSearchShopNameCount(NaturalLanguageFilter naturalLanguageFilter) {
		return getSqlSession().selectOne("naturalLanguageMapper.selectSearchShopNameCount", naturalLanguageFilter);
	}

	@Override
	public List<Interest> selectSearchInterestSection(NaturalLanguageFilter naturalLanguageFilter) {
		Pagination pagination = naturalLanguageFilter.getPagination();
		int count = selectSearchInterestSectionCount(naturalLanguageFilter);
		pagination.setNumItems(count);
		if (count == 0) {
			return new ArrayList<Interest>();
		}
		List<Interest> interests = getSqlSession().selectList("naturalLanguageMapper.selectSearchInterestSection", naturalLanguageFilter);
		return interests;
	}

	private int selectSearchInterestSectionCount(NaturalLanguageFilter naturalLanguageFilter) {
		return getSqlSession().selectOne("naturalLanguageMapper.selectSearchInterestSectionCount", naturalLanguageFilter);
	}

	@Override
	public List<JtownUser> selectSearchProductName(NaturalLanguageFilter naturalLanguageFilter) {
		return getSqlSession().selectList("naturalLanguageMapper.selectSearchProductName", naturalLanguageFilter);
	}

	@Override
	public List<Interest> selectSearchCategoryItemInShop(NaturalLanguageFilter naturalLanguageFilter) {
		return getSqlSession().selectList("naturalLanguageMapper.selectSearchCategoryItemInShop", naturalLanguageFilter);
	}
	
	

}
