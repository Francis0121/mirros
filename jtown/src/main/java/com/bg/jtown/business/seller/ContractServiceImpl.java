package com.bg.jtown.business.seller;

import java.util.ArrayList;
import java.util.List;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Contract;
import com.bg.jtown.business.search.ContractFilter;
import com.bg.jtown.util.Pagination;

/**
 * @author Francis
 * 
 */
@Service
public class ContractServiceImpl extends SqlSessionDaoSupport implements
		ContractService {

	@Override
	public List<Contract> selectContractList(ContractFilter contractFilter) {
		Pagination pagination = contractFilter.getPagination();
		int count = selectContractCount(contractFilter);
		if (count == 0) {
			return new ArrayList<Contract>();
		}
		pagination.setNumItems(count);

		List<Contract> contracts = getSqlSession().selectList(
				"contractMapper.selectContractList", contractFilter);
		return contracts;
	}

	@Override
	public Contract selectContract(Contract contract) {
		return getSqlSession().selectOne("contractMapper.selectContract",
				contract);
	}

	@Override
	public Integer selectContractCount(ContractFilter contractFilter) {
		return getSqlSession().selectOne("contractMapper.selectContractCount",
				contractFilter);
	}

	@Override
	public void insertContract(Contract contract) {
		getSqlSession().insert("contractMapper.insertContract", contract);
	}

	@Override
	public void deleteContract(Contract contract) {
		getSqlSession().delete("contractMapper.deleteContract", contract);
	}

	@Override
	public void updateContract(Contract contract) {
		getSqlSession().update("contractMapper.updateContract", contract);
	}
}
