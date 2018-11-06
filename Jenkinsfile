def label = "ercan-pod-${UUID.randomUUID().toString()}"
def project = 'altorumleren'
def appName = 'altorum-kube-test'
def imageTag = "${project}/${appName}:${env.BRANCH_NAME}.${env.BUILD_NUMBER}"
def overAllStatus = 'SUCCESS'
def private_docker_registry_address = 'http://88.198.38.226:5000'
node {
 def app
 currentBuild.result = 'SUCCESS'
 stage('Clone repository') {
  /* checkout scm */
  // repo test
  checkout scm
 }
 echo "branch name is ${env.BRANCH_NAME}"
 echo "branch name is ${BRANCH_NAME}"
 stage('Build image') {
  // This builds the actual image

  //app = docker.build("altorumleren/altorum-kube-test")
  app = docker.build("${project}/${appName}")
 }

 stage('Test image') {
  // Test image

  // Run command inside previously build docker image
  app.inside {
   sh 'node --version'
  }
 }
 try {
  stage('Push image') {
   /* Finally, we'll push the image with two tags:
    * First, the incremental build number from Jenkins
    * Second, the 'latest' tag.
    * Pushing multiple tags is cheap, as all the layers are reused. */
   docker.withRegistry("${private_docker_registry_address}", 'docker-registry-credential-id') {
    //app.push("${env.BUILD_NUMBER}")
    //app.push("latest")

    app.push("${env.BRANCH_NAME}.${env.BUILD_NUMBER}")
    app.push("latest")
   }
  }

 } catch (exception) {
  currentBuild.result = 'FAILURE'
  mail(body:
   "Pipeline error: ${exception}\nFix me.",
   subject: 'Pipeline build failed',
   to: 'ercan@altorumleren.com')
  echo 'caught error :' + exception

 } finally {



  if (currentBuild.result == 'FAILURE') {
   echo "first current build is ${currentBuild.result}"
  } else {
   echo "current build is ${currentBuild.result}"
   mail(body:
    "Pipeline message",
    from: 'jenkins@myjenkins.com',
    subject: 'Pipeline build SUCCESS',
    to: 'ercan@altorumleren.com')
  }
  echo 'execution ends.'
  overAllStatus = currentBuild.result
 }


}
if (currentBuild.result == 'SUCCESS') {
 podTemplate(label: label, containers: [
  containerTemplate(name: 'kubectl', image: 'lachlanevenson/k8s-kubectl:v1.10.2', command: 'cat', ttyEnabled: true),
  containerTemplate(name: 'jmeter', image: 'justb4/jmeter:3.3', command: 'cat', ttyEnabled: true)

 ]) {
  node(label) {
   echo "pod template current build is ${currentBuild.result}"
   echo "pod template overall  status is ${overAllStatus}"
   def app

   stage('Clone repository') {
    /* checkout scm */

    checkout scm
   }

   stage('jmeter container') {
    container('jmeter') {
     stage('Performance Test Application') {
      switch (env.BRANCH_NAME) {

       case "k8s":
        try {
         stage('jmeter events') {
          //sh 'chmod +x gradlew'
          //sh './gradlew build'

          sh 'ls ${workspace}'
          sh 'jmeter -v'

          stage('food-category - Performance Test Application') {
           echo 'food-category started'
           sh 'jmeter -n -t test/food-category.jmx -l food-category.jtl'
           sh 'jmeter -g food-category.jtl -o food-category'
          }
          stage('foodu-test - Performance Test Application') {
           echo 'foodu-test started'
           sh 'jmeter -n -t test/food4u-test.jmx -l food4u-test.jtl'
           sh 'jmeter -g food4u-test.jtl -o food4u-test'
          }
          stage('profile-basic-entities - Performance Test Application') {
           echo 'profile-basic-entities started'
           sh 'jmeter -n -t test/profile-basic-entities.jmx -l profile-basic-entities.jtl'
           sh 'jmeter -g profile-basic-entities.jtl -o profile-basic-entities'
          }

          stage('roles started - Performance Test Application') {
           echo 'roles started'
           sh 'jmeter -n -t test/roles.jmx -l roles.jtl'
           sh 'jmeter -g roles.jtl -o roles'
          }

          stage('food-category - Performance Test Application') {
           echo 'users-recipe started'
           sh 'jmeter -n -t test/users-recipe -l users-recipe.jtl'
           sh 'jmeter -g users-recipe.jtl -o users-recipe'
          }

          //sh 'ls app/build'
          sh 'ls ${workspace}'
          archiveArtifacts artifacts: 'food4u-test/**/*', excludes: '*.md'
          //sendEmailFunc("K8S Pipeline message ${currentBuild.result}", appName,"${artifactPath}/lint-results.html")
         }

        } catch (exception) {
         currentBuild.result = 'FAILURE'
         mail(body:
          "Pipeline error: ${exception}\nFix me.",
          subject: 'Pipeline build failed',
          to: 'ercan@altorumleren.com')
         echo 'caught error :' + exception

        }

        break;
       default:
        sh "ls ${workspace}"
        break;
      }

      //sh 'kubectl get pods -n jenkins'
      //sh "ls ${workspace}"
     }

    }
   }

   stage('kubectl container') {
    container('kubectl') {
     stage('Deploy Application') {
      switch (env.BRANCH_NAME) {
       case "master":
        sh("kubectl --namespace=production delete deployment food4u-nodejs-app-backend-production")
        sh("kubectl --namespace=production apply -f k8s/services/")
        sh("kubectl --namespace=production apply -f k8s/production/")
        break;
       case "development":
        sh("kubectl --namespace=dev delete deployment food4u-nodejs-app-backend-dev")
        sh("kubectl --namespace=dev apply -f k8s/services/")
        sh("kubectl --namespace=dev apply -f k8s/dev/")
        break;
       case "k8s":
        echo "kubectl container k8s do nothing..."
        //sh("kubectl --namespace=dev apply -f k8s/services/")
        //sh("kubectl --namespace=dev apply -f k8s/dev/")
        break;
       default:
        sh("kubectl --namespace=${env.BRANCH_NAME} apply -f k8s/services/")
        sh("kubectl --namespace=${env.BRANCH_NAME} apply -f k8s/dev/")
        break;
      }

      //sh 'kubectl get pods -n jenkins'
      //sh "ls ${workspace}"
     }
    }
   }
  }
 }

} else {
 echo "K8S Deployment not started"
}
