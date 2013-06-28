package com.bg.jtown.business.seller;

import java.util.ArrayList;
import java.util.List;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Service;

import com.bg.jtown.business.Contract;
import com.bg.jtown.business.search.ContractFilter;
import com.bg.jtown.util.DateUtil;
import com.bg.jtown.util.Pagination;

/**
 * @author Francis
 * 
 */
@Service
public class ContractServiceImpl extends SqlSessionDaoSupport implements
		ContractService {

	private static final Integer CONTRACT_PER_PAGE_NUM = 5;

	private Integer selectContractCount(ContractFilter contractFilter) {
		return getSqlSession().selectOne("contractMapper.selectContractCount",
				contractFilter);
	}

	@Override
	public List<Contract> selectContractList(ContractFilter contractFilter) {
		Pagination pagination = contractFilter.getPagination();
		int count = selectContractCount(contractFilter);
		pagination.setNumItems(count);
		pagination.setNumItemsPerPage(CONTRACT_PER_PAGE_NUM);
		if (count == 0) {
			return new ArrayList<Contract>();
		}
		List<Contract> contracts = getSqlSession().selectList(
				"contractMapper.selectContractList", contractFilter);
		return contracts;
	}

	@Override
	public Contract selectContract(Integer contractPn) {
		return getSqlSession().selectOne("contractMapper.selectContract",
				contractPn);
	}

	@Override
	public Contract selectContractPeroid(Integer sellerPn) {
		List<Contract> contracts = getSqlSession().selectList(
				"contractMapper.selectContractPeroid", sellerPn);
		if (contracts.size() == 0) {
			return new Contract(sellerPn);
		}

		Contract contract = contracts.get(0);
		contract.setContractEndDate(contract.getEndDate());
		return contract;
	}

	@Override
	public void insertCaculatePeroidContract(Contract contract) {
		String contractEndDate = contract.getContractEndDate();
		Integer peroid = contract.getContractPeroid();
		if (contractEndDate == null) {
			String startDate = contract.getStartDate();
			String endDate = DateUtil.addYearMonthDay(startDate, 0, 0, peroid);
			contract.setEndDate(endDate);
		} else {
			String startDate = DateUtil.addYearMonthDay(contractEndDate, 0, 0,
					1);
			String endDate = DateUtil.addYearMonthDay(startDate, 0, 0, peroid);
			contract.setStartDate(startDate);
			contract.setEndDate(endDate);
		}
		insertContract(contract);
	}

	@Override
	public void insertContract(Contract contract) {
		getSqlSession().insert("contractMapper.insertContract", contract);
	}

	@Override
	public void deleteContract(Integer contractPn) {
		getSqlSession().delete("contractMapper.deleteContract", contractPn);
	}

}
