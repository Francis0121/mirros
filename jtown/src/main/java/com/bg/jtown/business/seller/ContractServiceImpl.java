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
	public Contract selectContractPeroid(Contract contract) {
		Contract loadContract = getSqlSession().selectOne(
				"contractMapper.selctContractPeroid", contract);
		if (loadContract == null || loadContract.getSellerPn() == null) {
			return new Contract();
		}
		return loadContract;
	}

	@Override
	public Integer selectContractCount(ContractFilter contractFilter) {
		return getSqlSession().selectOne("contractMapper.selectContractCount",
				contractFilter);
	}

	@Override
	public Integer insertCaculatePeroidContract(Contract contract) {
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
		return 1;
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
