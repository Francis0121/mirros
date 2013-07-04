package com.bg.mirros.quartz;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.configuration.JobLocator;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.NoSuchJobException;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.scheduling.quartz.QuartzJobBean;

/**
 * 주기적으로 생성되는 빈
 * 
 * @author Francis
 * 
 */
public class CronQuartz extends QuartzJobBean {

	static final String JOB_NAME = "jobName";

	private JobLocator jobLocator;

	private JobLauncher jobLauncher;

	public void setJobLocator(JobLocator jobLocator) {
		this.jobLocator = jobLocator;
	}

	public void setJobLauncher(JobLauncher jobLauncher) {
		this.jobLauncher = jobLauncher;
	}

	private static Logger logger = LoggerFactory.getLogger(CronQuartz.class);

	@SuppressWarnings("unchecked")
	@Override
	protected void executeInternal(JobExecutionContext context)
			throws JobExecutionException {
		long start = System.currentTimeMillis();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd HH:mm:ss");
		Map<String, Object> jobDataMap = context.getMergedJobDataMap();
		String jobName = (String) jobDataMap.get(JOB_NAME);
		JobParameters jobParameters = getJobParametersFromJobMap(jobDataMap);
		logger.info("Cron trigger: current time = " + sdf.format(start) + " job Name : " + jobName);
		
		try {
			jobLauncher.run(jobLocator.getJob(jobName), jobParameters);
		} catch (JobExecutionAlreadyRunningException e) {
			logger.error("Could not execute job.", e);
		} catch (JobRestartException e) {
			logger.error("Could not execute job.", e);
		} catch (JobInstanceAlreadyCompleteException e) {
			logger.error("Could not execute job.", e);
		} catch (JobParametersInvalidException e) {
			logger.error("Could not execute job.", e);
		} catch (NoSuchJobException e) {
			logger.error("Could not execute job.", e);
		} finally {
			long finish = System.currentTimeMillis();
			logger.info("Finsih Quartz" + jobName + " during : " + (finish - start) + "ms");
		}

	}

	private JobParameters getJobParametersFromJobMap(
			Map<String, Object> jobDataMap) {
		JobParametersBuilder builder = new JobParametersBuilder();
		builder.addDate("date", new Date());
		return builder.toJobParameters();
	}

}
