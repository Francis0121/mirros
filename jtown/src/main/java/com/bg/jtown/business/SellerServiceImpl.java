package com.bg.jtown.business;

import java.util.HashMap;
import java.util.Map;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

import com.bg.jtown.security.JtownUser;
import com.bg.jtown.util.FileVO;

/**
 * @author Francis
 * 
 */
@Service
public class SellerServiceImpl extends SqlSessionDaoSupport implements
		SellerService {

	@Override
	public Map<String, Object> selectAllInformation(Integer properNumber) {
		Map<String, Object> map = new HashMap<String, Object>();

		map.put("jtownUser", selectSellerInformation(properNumber));
		map.put("mainImage", selectSellerImage(properNumber));

		return map;
	}

	@Override
	public JtownUser selectSellerInformation(Integer properNumber) {
		return getSqlSession().selectOne(
				"sellerMapper.selectSellerInformation", properNumber);
	}

	@Override
	public String selectSellerImage(Integer properNumber) {
		return getSqlSession().selectOne("sellerMapper.selectSellerImage",
				properNumber);
	}

	@Override
	public void insertSellerImage(FileVO fileVO) {
		getSqlSession().insert("sellerMapper.insertSellerImage", fileVO);
	}

	@Override
	public void updateSellerImage(FileVO fileVO) {
		String saveName = selectSellerImage(fileVO.getOwnerPn());
		if (null != saveName && !saveName.equals("")) {
			getSqlSession().update("sellerMapper.updateSellerImage", fileVO);
		} else {
			insertSellerImage(fileVO);
		}
	}

	@Override
	public void updateSellerNotice(JtownUser jtownUser) {
		getSqlSession().update("sellerMapper.updateSellerNotice", jtownUser);
	}

}
